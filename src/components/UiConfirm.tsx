import React from 'react';
import UiModal from './UiModal';
import UiButton from './UiButton';

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const UiConfirm: React.FC<Props> = ({ open, title = 'Confirmar', message = '¿Estás seguro?', onConfirm, onCancel }) => {
  return (
    <UiModal open={open} onClose={onCancel} title={title}>
      <p className="mb-4 text-gray-700">{message}</p>
      <div className="flex gap-3 justify-end">
        <UiButton label="Cancelar" variant="secondary" onClick={onCancel} />
        <UiButton label="Eliminar" variant="danger" onClick={onConfirm} />
      </div>
    </UiModal>
  );
};

export default UiConfirm;
