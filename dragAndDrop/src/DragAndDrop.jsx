import React, { useEffect, useRef, useState } from "react";

const DragAndDrop = ({ data: intialData }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("tasks-data");
    if (savedData) {
      return JSON.parse(savedData);
    }
    return intialData;
  });

  useEffect(() => {
    localStorage.setItem("tasks-data", JSON.stringify(data));
  }, [data]);

  const mainHeadings = Object.keys(data);

  const dragItem = useRef();
  const dragOverItem = useRef();

  function handleStartDrag(e, task, heading, idx) {
    e.target.style.opacity = "0.5";
    e.target.style.transform = "rotate(3deg)";
    dragItem.current = {
      task,
      heading,
      idx,
    };
  }

  function handleDragEnd(e) {
    e.target.style.opacity = "1";
    e.target.style.transform = "none";
  }

  // 1. Updated this function to stop event bubbling
  function handleDragEnter(e, idx, heading) {
    e.stopPropagation(); // <--- CRITICAL FIX: Stops the column from overriding this specific task index
    dragOverItem.current = { idx, heading };
  }

  // 2. Added this NEW function to handle dragging over empty columns
  function handleDragEnterColumn(heading) {
    // If we drag over the column background, set target to the END of the list
    dragOverItem.current = { 
        idx: data[heading].length, 
        heading 
    };
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop() {
    const source = dragItem.current;
    const dest = dragOverItem.current;

    if (!source || !dest) return null;

    setData((pre) => {
      if (source.heading == dest.heading) {
        const list = [...pre[source.heading]];
        const sourceIdx = source.idx;
        const destinationIdx = dest.idx;
        const [removedItem] = list.splice(sourceIdx, 1);
        list.splice(destinationIdx, 0, removedItem);

        return {
          ...pre,
          [source.heading]: list,
        };
      } else {
        const sourceList = [...pre[source.heading]];
        const detinationList = [...pre[dest.heading]];
        const sourceIdx = source.idx;
        const destinationIdx = dest.idx;
        const [removedItem] = sourceList.splice(sourceIdx, 1);
        detinationList.splice(destinationIdx, 0, removedItem);
        return {
          ...pre,
          [source.heading]: sourceList,
          [dest.heading]: detinationList,
        };
      }
    });
    dragItem.current = null;
    dragOverItem.current = null;
  }

  return (
    <div style={style.boardBackground}>
      <h1 style={style.mainTitle}>My Task Board</h1>
      <div style={style.boardContainer}>
        {mainHeadings.map((heading) => {
          return (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              // 3. Attach the new column handler here
              onDragEnter={() => handleDragEnterColumn(heading)}
              style={style.column}
              key={heading}
            >
              <div style={style.columnHeader}>
                <h3 style={style.headingText}>{heading.replace("_", " ")}</h3>
                <span style={style.badge}>{data[heading].length}</span>
              </div>

              <div style={style.taskList}>
                {data[heading].map((task, idx) => {
                  return (
                    <div
                      onDragStart={(e) => {
                        handleStartDrag(e, task, heading, idx);
                      }}
                      onDragEnd={handleDragEnd}
                      onDragEnter={(e) => {
                        handleDragEnter(e, idx, heading);
                      }}
                      draggable
                      style={style.taskCard}
                      key={task.id}
                    >
                      <p style={style.taskText}>{task.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DragAndDrop;

const style = {
  boardBackground: {
    backgroundColor: "#81abebff",
    //"#0079BF",
    minHeight: "100vh",
    width: "100%",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  mainTitle: {
    color: "white",
    textAlign: "center",
    marginBottom: "30px",
    marginTop: "0",
    fontSize: "2rem",
    textShadow: "0px 1px 3px rgba(0,0,0,0.3)",
  },
  boardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
  },
  column: {
    backgroundColor: "#EBECF0",
    borderRadius: "10px",
    width: "300px",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    maxHeight: "80vh",
  },
  columnHeader: {
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #DCDFE4",
  },
  headingText: {
    margin: "0",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#172B4D",
    textTransform: "uppercase",
  },
  badge: {
    backgroundColor: "#DFE1E6",
    color: "#42526E",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  taskList: {
    padding: "12px",
    flexGrow: 1,
    overflowY: "auto",
    minHeight: "50px", // Ensures you can drop into an empty list
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: "6px",
    padding: "12px 16px",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    cursor: "grab",
    transition: "transform 0.1s, box-shadow 0.1s",
    border: "1px solid transparent",
  },
  taskText: {
    margin: "0",
    color: "#172B4D",
    fontSize: "0.95rem",
    lineHeight: "1.4",
  },
};
