import React, { useState } from "react";
import "./DateParameterModal.css";

const dummyDates = [
  "9/9/2022", "2020-07-14 00:00:00", "4/29/2022", "2020-07-28 00:00:00",
  "7/1/2022", "2020-01-13 00:00:00", "11/5/2021", "2020-07-21 00:00:00",
  "6/10/2022", "8/20/2021", "2020-03-31 00:00:00", "12/30/2022", "9/3/2021",
  "2020-04-21 00:00:00", "9/16/2022", "2020-02-24 00:00:00", "1/14/2022",
  "11/26/2021", "10/1/2021", "2020-03-17 00:00:00", "6/17/2022",
  "2020-04-07 00:00:00", "5/27/2022", "12/17/2021", "8/5/2022",
  "3/25/2022", "2020-05-26 00:00:00", "4/15/2022", "11/25/2022",
  "12/9/2022", "2020-02-10 00:00:00", "5/13/2022", "12/3/2021",
  "2020-06-09 00:00:00", "7/22/2022", "1/28/2022", "9/2/2022",
  "2020-05-12 00:00:00", "12/2/2022", "8/12/2022", "2020-01-27 00:00:00",
  "12/10/2021", "9/30/2022", "2020-08-11 00:00:00", "3/4/2022",
  "2020-03-24 00:00:00", "10/15/2021", "1/7/2022", "2020-05-19 00:00:00",
  "2/25/2022", "10/22/2021", "11/12/2021", "4/22/2022", "9/17/2021",
  "8/26/2022", "2020-06-16 00:00:00", "2020-01-20 00:00:00", "10/8/2021",
  "7/15/2022", "2020-04-28 00:00:00", "9/23/2022", "2020-06-23 00:00:00",
  "8/6/2021", "9/24/2021", "5/6/2022", "3/18/2022", "8/27/2021",
  "2020-07-07 00:00:00", "10/7/2022", "1/21/2022", "7/29/2022",
  "9/10/2021", "8/19/2022", "2020-06-02 00:00:00", "2/18/2022",
  "3/11/2022", "2020-03-10 00:00:00", "2/4/2022", "6/24/2022",
  "2020-08-04 00:00:00", "6/3/2022", "5/20/2022", "11/19/2021",
  "10/21/2022", "2/11/2022", "2020-08-18 00:00:00", "2020-06-30 00:00:00",
  "4/1/2022", "10/29/2021", "7/8/2022", "10/14/2022", "2020-04-14 00:00:00",
  "12/31/2021", "10/28/2022", "11/4/2022", "11/11/2022", "12/16/2022",
  "2020-03-03 00:00:00", "4/8/2022", "12/23/2022", "2020-05-05 00:00:00",
  "2020-02-17 00:00:00", "12/24/2021", "2020-01-06 00:00:00", "11/18/2022",
  "2020-02-03 00:00:00"
];

const groupDates = (dates) => {
  const grouped = {};
  dates.forEach((date) => {
    const [year, month, day] = new Date(date).toISOString().split("T")[0].split("-");
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(day);
  });
  return grouped;
};

const DateParameterModal = ({ open, onClose, onSubmit }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [expanded, setExpanded] = useState({});
  const groupedDates = groupDates(dummyDates);

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSelection = (dates) => {
    const allSelected = dates.every((date) => selectedDates.includes(date));
    setSelectedDates((prev) =>
      allSelected
        ? prev.filter((date) => !dates.includes(date))
        : [...prev, ...dates.filter((date) => !prev.includes(date))]
    );
  };

  if (!open) return null;

  return (
    <div className="date-modal-overlay">
      <div className="date-modal-content">
        <header className="date-modal-header">
          <h3>Select Dates</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="date-modal-tree">
          <ul>
            {Object.entries(groupedDates).map(([year, months]) => {
              const yearDates = Object.entries(months).flatMap(([month, days]) =>
                days.map((day) => `${year}-${month}-${day}`)
              );
              return (
                <li key={year}>
                  <label>
                    <input
                      type="checkbox"
                      checked={yearDates.every((date) => selectedDates.includes(date))}
                      onChange={() => toggleSelection(yearDates)}
                    />
                    <span onClick={() => toggleExpand(year)} className="tree-node">
                      {expanded[year] ? "▼" : "▶"} {year}
                    </span>
                  </label>
                  {expanded[year] && (
                    <ul>
                      {Object.entries(months).map(([month, days]) => {
                        const monthDates = days.map((day) => `${year}-${month}-${day}`);
                        const key = `${year}-${month}`;
                        return (
                          <li key={key}>
                            <label>
                              <input
                                type="checkbox"
                                checked={monthDates.every((date) => selectedDates.includes(date))}
                                onChange={() => toggleSelection(monthDates)}
                              />
                              <span onClick={() => toggleExpand(key)} className="tree-node">
                                {expanded[key] ? "▼" : "▶"} {month}
                              </span>
                            </label>
                            {expanded[key] && (
                              <ul>
                                {days.map((day) => {
                                  const fullDate = `${year}-${month}-${day}`;
                                  return (
                                    <li key={fullDate}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={selectedDates.includes(fullDate)}
                                          onChange={() => toggleSelection([fullDate])}
                                        />
                                        {day}
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="date-modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              onSubmit(selectedDates);
              onClose();
            }}
          >
            Submit
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DateParameterModal;