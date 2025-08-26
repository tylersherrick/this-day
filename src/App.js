import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const fetchEvents = async (selectedDate) => {
    setLoading(true);
    try {
      const [year, month, day] = selectedDate.split("-");
      const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;
      const res = await fetch(url);
      if (!res.ok) {
        setEvents([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(date);
  }, [date]);

  const sortedEvents = [...events].sort((a, b) =>
    sortNewestFirst ? Number(b.year) - Number(a.year) : Number(a.year) - Number(b.year)
  );

  return (
    <div>
      <h1>This Day in History</h1>
      <div>
       <div className="controls">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={() => setSortNewestFirst(!sortNewestFirst)}>
          {sortNewestFirst ? "Sort Oldest → Newest" : "Sort Newest → Oldest"}
        </button>
      </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : sortedEvents.length === 0 ? (
        <p>No events found for this date.</p>
      ) : (
        <ul>
          {sortedEvents.map((event, index) => (
            <li key={index}>
              <strong>{event.year}</strong>: {event.text || event.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
