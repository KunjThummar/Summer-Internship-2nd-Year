import React from 'react';
import '../../styles/tables.css';

const Table = ({ columns = [], data = [], onRowClick, emptyMessage = 'No data available' }) => {
  return (
    <div className="table-container">
      <table className="table-responsive">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={col.width ? { width: col.width } : {}}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                style={onRowClick ? { cursor: 'pointer' } : {}}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
