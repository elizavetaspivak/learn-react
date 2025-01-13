import { ProductConfig } from '../types/ProductConfig';
import { useEffect, useReducer, useState } from 'react';

interface ProductConfiguratorProps {
  initialConfig: ProductConfig;
  onSave: (config: ProductConfig) => Promise<void>;
}

type Action =
  | { type: 'UPDATE_BASICS'; payload: Partial<ProductConfig['basics']> }
  | { type: 'TOGGLE_FEATURE'; featureKey: string; enabled: boolean }
  | { type: 'UPDATE_FEATURE_LEVEL'; featureKey: string; level: 'basic' | 'premium' }
  | { type: 'UPDATE_FEATURE_SETTINGS'; featureKey: string; settings: Record<string, unknown> }
  | { type: 'ADD_ADDON'; addon: ProductConfig['addons'][number] }
  | { type: 'REMOVE_ADDON'; addonId: string }
  | { type: 'UPDATE_ADDON'; addonId: string; updates: Partial<ProductConfig['addons'][number |string]> }
  | { type: 'UNDO_CHANGE' }
  | { type: 'SAVE_CONFIG' };

interface State {
  currentConfig: ProductConfig;
  history: ProductConfig[];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_BASICS':
      return {
        ...state,
        currentConfig: {
          ...state.currentConfig,
          basics: { ...state.currentConfig.basics, ...action.payload },
        },
        history: [state.currentConfig, ...state.history].slice(0, 5),
      };
    case 'TOGGLE_FEATURE':
      return {
        ...state,
        currentConfig: {
          ...state.currentConfig,
          features: {
            ...state.currentConfig.features,
            [action.featureKey]: {
              ...state.currentConfig.features[action.featureKey],
              enabled: action.enabled,
            },
          },
        },
        history: [state.currentConfig, ...state.history].slice(0, 5),
      };
    case 'UPDATE_FEATURE_LEVEL':
      return {
        ...state,
        currentConfig: {
          ...state.currentConfig,
          features: {
            ...state.currentConfig.features,
            [action.featureKey]: {
              ...state.currentConfig.features[action.featureKey],
              level: action.level,
            },
          },
        },
        history: [state.currentConfig, ...state.history].slice(0, 5),
      };
    case 'UPDATE_FEATURE_SETTINGS':
      return {
        ...state,
        currentConfig: {
          ...state.currentConfig,
          features: {
            ...state.currentConfig.features,
            [action.featureKey]: {
              ...state.currentConfig.features[action.featureKey],
              settings: {
                ...state.currentConfig.features[action.featureKey].settings,
                ...action.settings,
              },
            },
          },
        },
        history: [state.currentConfig, ...state.history].slice(0, 5),
      };
    case 'ADD_ADDON':
      return {
        ...state,
        currentConfig: {
          ...state.currentConfig,
          addons: [...state.currentConfig.addons, action.addon],
        },
        history: [state.currentConfig, ...state.history].slice(0, 5),
      };
    case 'REMOVE_ADDON':
      return {
        ...state,
        currentConfig: {
          ...state.currentConfig,
          addons: state.currentConfig.addons.filter((addon) => addon.id !== action.addonId),
        },
        history: [state.currentConfig, ...state.history].slice(0, 5),
      };
    case 'UPDATE_ADDON':
      return {
        ...state,
        currentConfig: {
          ...state.currentConfig,
          addons: state.currentConfig.addons.map((addon) =>
            addon.id === action.addonId ? { ...addon, ...action.updates } : addon
          ),
        },
        history: [state.currentConfig, ...state.history].slice(0, 5),
      };
    case 'UNDO_CHANGE': {
      if (state.history.length === 0) return state;
      const [lastConfig, ...restHistory] = state.history;
      return { ...state, currentConfig: lastConfig, history: restHistory };
    }
    case 'SAVE_CONFIG':
      return state;
    default:
      return state;
  }
}

export function ProductConfigurator({ initialConfig, onSave }: ProductConfiguratorProps) {
  const [basicErrors, setBasicErrors] = useState<{ [path: string]: string } | null>(null);
  const [featuresErrors, setFeaturesErrors] = useState<{
    [path: string]: { [path: string]: string };
  } | null>(null);
  const [addonsErrors, setAddonsErrors] = useState<{
    [path: string]: { [path: string]: string };
  } | null>(null);
  const [state, dispatch] = useReducer(reducer, {
    currentConfig: initialConfig,
    history: [],
  });

  function validateConfig() {
    setBasicErrors(null);
    setFeaturesErrors(null);
    setAddonsErrors(null);
    // Validate basics
    if (!state.currentConfig.basics.color) setBasicErrors({ color: 'Invalid value' });
    if (!state.currentConfig.basics.size) setBasicErrors({ size: 'Invalid value' });
    if (!state.currentConfig.basics.material) setBasicErrors({ material: 'Invalid value' });

    // Validate features
    Object.entries(state.currentConfig.features).forEach(([key, feature]) => {
      if (feature.enabled && !feature.level) {
        setFeaturesErrors({ [key]: { level: 'Feature must have a level set.' } });
      }
    });

    // Validate addons
    state.currentConfig.addons.forEach((addon) => {
      if (addon.quantity <= 0) setAddonsErrors({ [addon.id]: { quantity: 'Invalid quantity' } });
      if (addon.quantity >= 999) setAddonsErrors({ [addon.id]: { quantity: 'Invalid quantity' } });
    });
  }

  const handleSave = async () => {
    if (basicErrors === null && featuresErrors === null && addonsErrors === null) {
      await onSave(state.currentConfig);
    }
  };

  useEffect(() => {
    validateConfig();
  }, [state.currentConfig]);

  console.log(basicErrors, 'basicErrors');
  // TODO: Implement state management for the configuration
  // Hint: Consider using useState for the current config and change history

  // TODO: Implement change tracking
  // Hint: Keep track of the last 5 changes for undo functionality

  // TODO: Implement validation logic
  // Hint: Check feature dependencies and quantity limits

  const findChanges = (key: 'color' | 'size' | 'material', value: string) => {
    if (state.history.length > 0) {
      const changedConfig = state.history.find((h) => h.basics[key] !== value);

      if (changedConfig) {
        return (
          <div>
            changed {key} to {state.currentConfig.basics[key]}
          </div>
        );
      }
    }
  };
  return (
    <div className="product-configurator">
      <div className="config-section">
        <h3>Basic Settings</h3>
        <div className="form-group">
          <label>
            Color:
            <input
              type="text"
              value={state.currentConfig.basics.color}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_BASICS', payload: { color: e.target.value } })
              }
            />
            {findChanges('color', state.currentConfig.basics.color)}
            {basicErrors ? basicErrors['color'] : ''}
          </label>
        </div>
        <div className="form-group">
          <label>
            Size:
            <input
              type="text"
              value={state.currentConfig.basics.size}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_BASICS', payload: { size: e.target.value } })
              }
            />
            {findChanges('size', state.currentConfig.basics.size)}
            {basicErrors ? basicErrors['size'] : ''}
          </label>
        </div>
        <div className="form-group">
          <label>
            Material:
            <input
              type="text"
              value={state.currentConfig.basics.material}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_BASICS', payload: { material: e.target.value } })
              }
            />
            {findChanges('material', state.currentConfig.basics.material)}
            {basicErrors ? basicErrors['material'] : ''}
          </label>
        </div>

        {/* TODO: Implement controls for color, size, and material */}
      </div>

      <div className="config-section">
        <h3>Features</h3>
        {Object.entries(state.currentConfig.features).map(([key, feature]) => (
          <div key={key} className="form-group">
            <label>
              {key} Enabled:
              <input
                role={'switch'}
                aria-label={key}
                type="checkbox"
                checked={feature.enabled}
                onChange={(e) =>
                  dispatch({ type: 'TOGGLE_FEATURE', featureKey: key, enabled: e.target.checked })
                }
              />
            </label>
            {feature.enabled && (
              <div className="form-group">
                <label>
                  Level:
                  <select
                    value={feature.level}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_FEATURE_LEVEL',
                        featureKey: key,
                        level: e.target.value as 'basic' | 'premium',
                      })
                    }
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                  {featuresErrors ? featuresErrors[key]['level'] : ''}
                </label>
              </div>
            )}
          </div>
        ))}
        {/* TODO: Implement feature toggles and their settings */}
      </div>

      <div className="config-section">
        <h3>Add-ons</h3>
        {state.currentConfig.addons.map((addon) => (
          <div key={addon.id} className="form-group">
            <label>
              {addon.id} Quantity:
              <input
                type="number"
                value={addon.quantity}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_ADDON',
                    addonId: addon.id,
                    updates: { quantity: parseInt(e.target.value, 10) },
                  })
                }
              />
              {addonsErrors ? addonsErrors[addon.id]['quantity'] : ''}
            </label>
            <label>
              text:
              <input
                type="text"
                value={addon.customization.text}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_ADDON',
                    addonId: addon.id,
                    updates: { text: e.currentTarget.value },
                  })
                }
              />
            </label>
            <button onClick={() => dispatch({ type: 'REMOVE_ADDON', addonId: addon.id })}>
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            dispatch({
              type: 'ADD_ADDON',
              addon: { id: Date.now().toString(), quantity: 1, customization: {} },
            })
          }
        >
          Add Addon
        </button>
        {/* TODO: Implement add-on management with quantities and customization */}
      </div>

      <div className="config-preview">
        <h3>Preview</h3>
        <div>
          <div> color - {state.currentConfig.basics.color}</div>
          <div>size -{state.currentConfig.basics.size}</div>
          <div>material -{state.currentConfig.basics.material}</div>
          <br />

          {Object.entries(state.currentConfig.features).map((el) => (
            <div>
              feature: {el[0]}
              <div>level - {el[1].level}</div>
              <div>enabled - {el[1].enabled ? 'yes' : 'no'}</div>
              <br />
            </div>
          ))}
        </div>
        {/* TODO: Show current configuration state */}
      </div>

      <div className="config-history">
        <h3>History</h3>
        <ul role={'listitem'} aria-label="change history entry">
          {state.history.map((config, index) => (
            <li key={index}>
              Basics: Color: {config.basics.color}, Size: {config.basics.size}, Material:{' '}
              {config.basics.material}
            </li>
          ))}
        </ul>
        <button onClick={() => dispatch({ type: 'UNDO_CHANGE' })}>Undo</button>
        {/* TODO: Show change history and implement undo button */}
      </div>

      <div className="config-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleSave}>Apply preset</button>
      </div>
    </div>
  );
}
