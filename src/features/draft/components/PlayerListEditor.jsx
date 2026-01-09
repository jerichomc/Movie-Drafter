import { useState } from 'react';

function PlayerListEditor({ players, dispatch }) {
  const [newName, setNewName] = useState('');

  function handleAdd() {
    const trimmed = newName.trim();
    dispatch({
      type: 'ADD_PLAYER',
      payload: { name: trimmed },
    });
    setNewName('');
  }

  return (
    <div>
      <h3>Players</h3>

      {/* Add player */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Enter player name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {/* List players */}
      <div style={{ display: 'grid', gap: 8 }}>
        {players.map((player) => (
          <div
            key={player.id}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={player.name}
              onChange={(e) =>
                dispatch({
                  type: 'RENAME_PLAYER',
                  payload: { playerId: player.id, name: e.target.value },
                })
              }
            />

            <button
              onClick={() =>
                dispatch({
                  type: 'REMOVE_PLAYER',
                  payload: { playerId: player.id },
                })
              }
            >
              Remove
            </button>
          </div>
        ))}

        {players.length === 0 && (
          <div style={{ opacity: 0.8 }}>No players yet. Add one above.</div>
        )}
      </div>
    </div>
  );
}

export default PlayerListEditor;
