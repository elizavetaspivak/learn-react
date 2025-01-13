import { useEffect, useState } from "react";

export type UserProfile = {
  displayName: string;
  email: string;
  phone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
};

export type UserProfileErrors = {
  displayName: null | string;
  email: null | string;
  phone: null | string;
  emailNotifications: null | string;
  smsNotifications: null | string;
};

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => Promise<void>;
  initialData: UserProfile;
}

export function UserProfileForm({ onSubmit, initialData }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [haveChanges, setHaveChanges] = useState<boolean>(false);
  const [formDataErrors, setFormDataErrors] = useState<UserProfileErrors>({
    displayName: null,
    email: null,
    phone: null,
    emailNotifications: null,
    smsNotifications: null,
  });
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleChange = (
    value: string | boolean,
    profileKey: keyof UserProfile,
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [profileKey]: value,
    }));

    validate(value, profileKey);
    checkChanges()
  };

  const validate = (value: string | boolean, key: keyof UserProfile) => {
    switch (key) {
      case "displayName": {
        const newValue = value as string;
        if (newValue === null || newValue.length === 0) {
          setFormDataErrors((prevState) => ({
            ...prevState,
            displayName: "Shouldn't be empty!",
          }));
        } else {
          setFormDataErrors((prevState) => ({
            ...prevState,
            displayName: null,
          }));
        }
        break;
      }
      case "email": {
        const newValue = value as string;
        if (newValue === null || newValue.length === 0) {
          setFormDataErrors((prevState) => ({
            ...prevState,
            emailError: "Shouldn't be empty!",
          }));
        } else {
          setFormDataErrors((prevState) => ({
            ...prevState,
            emailError: null,
          }));
        }

        const testRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (newValue !== null && !newValue.match(testRegex)) {
          setFormDataErrors((prevState) => ({
            ...prevState,
            email: "Invalid email format!",
          }));
        } else {
          setFormDataErrors((prevState) => ({
            ...prevState,
            email: null,
          }));
        }
        break;
      }
      case "phone": {
        const newValue = value as string;

        if (newValue === null || newValue.length === 0) {
          setFormDataErrors((prevState) => ({
            ...prevState,
            phone: "Shouldn't be empty!",
          }));
        } else {
          setFormDataErrors((prevState) => ({
            ...prevState,
            phone: null,
          }));
        }

        const testRegex =
          "^[\+][(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$";
        if (newValue !== null && !newValue.match(testRegex)) {
          setFormDataErrors((prevState) => ({
            ...prevState,
            phone: "Incorrect value!",
          }));
        } else {
          setFormDataErrors((prevState) => ({
            ...prevState,
            phone: null,
          }));
        }
        break;
      }
      case "emailNotifications":
        if (value === false && !formData.smsNotifications) {
          setFormDataErrors((prevState) => ({
            ...prevState,
            emailNotifications: "One checkbox need to be checked!",
          }));
        } else {
          setFormDataErrors((prevState) => ({
            ...prevState,
            emailNotifications: null,
            smsNotifications: null,
          }));
        }
        break;
      case "smsNotifications":
        if (value === false && !formData.emailNotifications) {
          setFormDataErrors((prevState) => ({
            ...prevState,
            smsNotifications: "One checkbox need to be checked!",
          }));
        } else {
          setFormDataErrors((prevState) => ({
            ...prevState,
            smsNotifications: null,
            emailNotifications: null,
          }));
        }
        break;
    }
  };

  const checkChanges = () => {
    if (
      initialData.displayName === formData.displayName &&
      initialData.email === formData.email &&
      initialData.phone === formData.phone &&
      initialData.emailNotifications === formData.emailNotifications &&
      initialData.smsNotifications === formData.smsNotifications
    ) {
      setHaveChanges(false)
      setIsValid(false)
    }else {
      setHaveChanges(true)
      setIsValid(true)
    }
  };

  useEffect(() => {
    const somethingIsNotValid = Object.values(formDataErrors).some(
      (v) => v !== null,
    );

    setIsValid(!somethingIsNotValid);
  }, [formDataErrors]);

  useEffect(() => {
   checkChanges()
  }, []);
  // TODO: Implement state management for form fields
  // Hint: Consider using multiple useState hooks or a single useState with an object

  // TODO: Implement form validation
  // Hint: Track validation state for each field

  // TODO: Implement change tracking
  // Hint: Compare current values with initialData

  const handleSubmit = () => {
    isValid && onSubmit(formData);
  };

  const resetFormHandle = () => {
    setFormData(initialData)
  }

  return (
    <div className="profile-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
          // TODO: Implement form submission
        }}
      >
        <div className="form-section">
          <h3>Contact Information</h3>
          <div>
            <label className="form-field">
              Display Name
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  handleChange(e.currentTarget.value, "displayName")
                }
              />
              {formDataErrors.displayName !== null && (
                <p className="error">{formDataErrors.displayName}</p>
              )}
            </label>
          </div>
          <div>
            <label className="form-field">
              Email
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange(e.currentTarget.value, "email")}
              />
              {formDataErrors.email !== null && (
                <p className="error">{formDataErrors.email}</p>
              )}
            </label>
          </div>
          <div>
            <label className="form-field">
              Phone
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange(e.currentTarget.value, "phone")}
              />
              {formDataErrors.phone !== null && (
                <p className="error">{formDataErrors.phone}</p>
              )}
            </label>
          </div>
          {/* TODO: Implement contact information fields */}
          {/* Required fields: displayName, email, phone */}
        </div>

        <div className="form-section">
          <h3>Notification Preferences</h3>
          <div>
            Email
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) =>
                  handleChange(e.currentTarget.checked, "emailNotifications")
                }
              />
              {formDataErrors.emailNotifications !== null && (
                <p className="error">{formDataErrors.emailNotifications}</p>
              )}
          </div>
          <div>
              Sms
              <input
                type="checkbox"
                checked={formData.smsNotifications}
                onChange={(e) =>
                  handleChange(e.currentTarget.checked, "smsNotifications")
                }
              />
              {formDataErrors.smsNotifications !== null && (
                <p className="error">{formDataErrors.smsNotifications}</p>
              )}
          </div>
          {/* TODO: Implement notification toggles */}
          {/* Fields: emailNotifications, smsNotifications */}
        </div>

        <div className="form-preview">
          <h3 role={'region'}>Preview</h3>
          <div role="region" aria-label="Preview">
            <div>
              {formData.displayName}
            </div>
            <div>
              {formData.email}
            </div>
          <div>
            {formData.phone}
          </div>
          </div>
          {/*<div>*/}
          {/*  EmailNotifications -*/}
          {/*  <input*/}
          {/*    type="checkbox"*/}
          {/*    disabled*/}
          {/*    checked={formData.emailNotifications}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  SMSNotifications -*/}
          {/*  <input*/}
          {/*    type="checkbox"*/}
          {/*    disabled*/}
          {/*    checked={formData.smsNotifications}*/}
          {/*  />*/}
          {/*</div>*/}
          {/* TODO: Show real-time preview of form changes */}
        </div>

        <div className="form-actions">
          {/* TODO: Implement Submit and Reset buttons */}
          {/* Submit should be disabled if form is invalid or unchanged */}
          <button type={"submit"} disabled={!isValid && !haveChanges}>
            submit
          </button>
          <button type={"reset"} onClick={resetFormHandle}>reset</button>
        </div>
      </form>
    </div>
  );
}
