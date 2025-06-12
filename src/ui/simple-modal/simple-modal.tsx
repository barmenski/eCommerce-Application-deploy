import type { JSX, Ref } from 'react';
import './simple-modal.css';

type SimpleModalProps = {
  message: string;
  title: string;
  dialogReference: Ref<HTMLDialogElement> | undefined;
  callback: () => Promise<void>;
};

export default function SimpleModal(props: SimpleModalProps): JSX.Element {
  const { message, title, dialogReference, callback } = props;

  function handleEscape(event: { key: string }): void {
    if (!dialogReference) return;
    if (event.key === 'Escape' && 'current' in dialogReference) {
      dialogReference?.current?.close();
    }
  }

  function handleCloseEvent(): void {
    if (!dialogReference) return;

    if ('current' in dialogReference) {
      dialogReference?.current?.close();
    }
  }

  function handleClick(): void {
    callback();
  }

  return (
    <dialog ref={dialogReference} onKeyDown={handleEscape} className="simple-modal">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="simple-modal-btn-wrapper">
        <button
          onClick={handleClick}
          type="button"
          className="simple-modal-btn-style"
          id="simple-modal-ok"
        >
          OK
        </button>
        <button
          onClick={handleCloseEvent}
          type="button"
          className="simple-modal-btn-style"
          id="simple-modal-cancel"
        >
          Cancel
        </button>
      </div>
    </dialog>
  );
}
