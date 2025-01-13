import './App.css';
import { ProductConfigurator } from './components/ProductConfigurator.tsx';
import {ProductConfig} from "./types/ProductConfig.ts";

const initialData: ProductConfig = {
  basics: {
    color: 'red',
    size: 'medium',
    material: 'cotton',
  },
  features: {
    waterproof: {
      enabled: false,
      level: 'basic',
      settings: {},
    },
    armor: {
      enabled: false,
      level: 'basic',
      settings: {},
    },
  },
  addons: [
    {
      id: 'gift-wrap',
      quantity: 1,
      customization: {
        color: 'blue',
        text: 'large'
      },
    },
  ],
}

function App() {
  const handleSave = async (config: any) => {
    // Имитация отправки данных на сервер
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Submitted config:', config);
  };

  return (
    <div>
      <ProductConfigurator initialConfig={initialData} onSave={handleSave} />
    </div>
  );
}

export default App;
