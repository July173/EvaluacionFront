import React from 'react';

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
};

function UiTable<T>({ columns, data, actions }: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-green-50">
            {columns.map((c) => (
              <th key={String(c.key)} className="text-left px-4 py-2 text-sm text-gray-600">{c.label}</th>
            ))}
            {actions && <th className="px-4 py-2 text-sm text-gray-600">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t hover:bg-green-50">
              {columns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-2 text-sm text-gray-700">
                    {(() => {
                      if (c.render) return c.render(row);
                      const val = (row as Record<string, unknown>)[String(c.key)];
                      if (val === null || val === undefined) return '';
                      return val as React.ReactNode;
                    })()}
                </td>
              ))}
              {actions && <td className="px-4 py-2">{actions(row)}</td>}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-6 text-center text-gray-500">
                No hay registros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UiTable;
