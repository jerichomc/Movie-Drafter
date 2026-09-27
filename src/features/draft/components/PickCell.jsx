function PickCell({ pick, isCurrent, playerName, hostColor }) {
  const item = pick.item;

  return (
    <article
      className={`pick-card${isCurrent ? ' pick-card-current' : ''}${item ? ' pick-card-filled' : ''}`}
      style={{ '--host-color': hostColor }}
      aria-label={`${playerName}, pick ${pick.pickIndex + 1}: ${item?.title ?? (isCurrent ? 'on the clock' : 'not picked yet')}`}
      aria-current={isCurrent ? 'step' : undefined}
    >
      <div className="pick-artwork">
        {item?.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} />
        ) : (
          <div className="pick-placeholder">
            <span className="pick-placeholder-number">{String(pick.pickIndex + 1).padStart(2, '0')}</span>
            <span>{item ? 'No image available' : isCurrent ? 'On the clock' : 'Awaiting pick'}</span>
          </div>
        )}
        {item && <span className="pick-number">#{String(pick.pickIndex + 1).padStart(2, '0')}</span>}
      </div>
      {item && (
        <div className="pick-caption">
          <div className="pick-title">{item.title}</div>
          <div className="pick-subtitle">{item.subtitle || 'Draft selection'}</div>
        </div>
      )}
    </article>
  );
}

export default PickCell;
