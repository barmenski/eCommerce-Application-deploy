import type { Dispatch, JSX, SetStateAction } from 'react';

export default function ControlButtons({
  isFirstStep,
  setStep,
  isValid,
}: {
  isFirstStep: boolean;
  setStep: Dispatch<SetStateAction<boolean>>;
  isValid: boolean;
}): JSX.Element {
  function handleBackButton(): void {
    setStep(!isFirstStep);
  }

  function handleNextButton(): void {
    setStep(!isFirstStep);
  }

  return (
    <div className="sign-up-form-control-buttons">
      {!isFirstStep && (
        <button
          className={[
            'control-btn-style',
            'sign-up-form-control-back-button',
            isFirstStep && 'disabled',
          ].join(' ')}
          onClick={handleBackButton}
          type="button"
          disabled={isFirstStep}
        >
          Back
        </button>
      )}
      {isFirstStep && (
        <button
          className={[
            'control-btn-style',
            'sign-up-form-control-next-button',
            !isValid && 'disabled',
          ].join(' ')}
          onClick={handleNextButton}
          type="button"
          disabled={!isValid}
        >
          Next
        </button>
      )}
    </div>
  );
}
