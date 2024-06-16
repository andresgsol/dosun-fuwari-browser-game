const puzzle1 = [
  [0, 0, 1, 1],
  [2, -1, 1, 3],
  [2, 4, 1, 3],
  [2, 4, 4, -1],
];

const puzzle2 = [
  [1, 1, 2, 2, 3, 3, 4, -1, -1, 5],
  [6, 6, 2, -1, 7, 7, 4, 4, 5, 5],
  [8, -1, 2, 9, 9, 10, -1, 4, 4, 5],
  [8, 2, 2, 9, -1, 10, 11, 11, 12, -1],
  [8, 13, 13, 14, 14, 10, 15, 11, 12, 16],
  [17, 17, 13, 14, 18, 15, 15, 11, 12, 16],
  [-1, 19, 13, 14, 18, -1, 20, 11, 11, 16],
  [19, 19, 19, -1, 18, 20, 20, 21, -1, 16],
  [22, 23, 23, 23, 24, 24, -1, 21, 21, 21],
  [22, -1, -1, 25, 25, 24, 21, 21, 26, 26]
];

const puzzle3 = [
  [1, 2, 2, 2, -1, 3, 3, 4, 4, 5],
  [1, 2, -1, 2, 2, 2, 3, 4, -1, 5],
  [1, 2, 2, 6, 6, -1, 3, 4, -1, 5],
  [1, -1, 7, 7, 6, 6, 8, 8, 8, 8],
  [9, 9, 9, 7, 7, 6, 6, 10, 10, -1],
  [11, 11, 11, 11, 12, 12, 6, 6, 6, -1],
  [13, 13, 13, 14, 14, 12, 12, -1, 15, 16],
  [17, 17, 13, 14, -1, 12, -1, 18, 15, 16],
  [-1, 17, 13, 14, 14, 12, 18, 18, 15, 16],
  [-1, 17, 13, 13, 13, 12, 12, 18, 15, 15]
];

document.addEventListener("DOMContentLoaded", () => {
  initGame(puzzle1);
});

function loadPuzzle1(element) {
  updateActive(element);
  initGame(puzzle1);
}

function loadPuzzle2(element) {
  updateActive(element);
  initGame(puzzle2);
}

function loadPuzzle3(element) {
  updateActive(element);
  initGame(puzzle3);
}

function updateActive(element) {
  document.querySelectorAll(".puzzle-select").forEach(function (activeElement) {
    activeElement.classList.remove("active");
  });
  element.classList.add("active");
}

function initGame(grid) {
  let circles = Array(grid.length)
    .fill()
    .map(() => Array(grid[0].length).fill(0));

  const container = document.getElementById("grid-container");
  container.innerHTML = "";

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      if (cell === -1) {
        cellDiv.classList.add("black");
      } else {
        addBorders(rowIndex, colIndex, cell, cellDiv);
        addClickHandler(rowIndex, colIndex, cellDiv);
      }

      container.appendChild(cellDiv);
    });

    container.style.gridTemplateColumns = "repeat(" + grid[0].length + ", 50px)";
  });

  document.getElementById("validate").onclick = () => {
    if (isSolved(grid, circles)) {
      alert("Congratulations! You did it!");
    } else {
      alert("Nope... Check that all groups have an anvil and a balloon");
    }
  };

  function addBorders(rowIndex, colIndex, cell, cellDiv) {
    if (rowIndex > 0 && grid[rowIndex - 1][colIndex] !== cell) {
      cellDiv.classList.add("top-thick-border");
    }
    if (rowIndex + 1 < grid.length && grid[rowIndex + 1][colIndex] !== cell) {
      cellDiv.classList.add("bottom-thick-border");
    }
    if (colIndex > 0 && grid[rowIndex][colIndex - 1] !== cell) {
      cellDiv.classList.add("left-thick-border");
    }
    if (
      colIndex + 1 < grid[rowIndex].length &&
      grid[rowIndex][colIndex + 1] !== cell
    ) {
      cellDiv.classList.add("right-thick-border");
    }
  }

  function addClickHandler(rowIndex, colIndex, cellDiv) {
    cellDiv.addEventListener("click", () => {
      const isAnvil =
        document.querySelector("input[name='circle-type']:checked").id ==
        "anvil";
      const circleDiv = cellDiv.querySelector(".circle");
      if (circleDiv) {
        circles[rowIndex][colIndex] = 0;
        cellDiv.removeChild(circleDiv);
      } else {
        if (isValidCircle(rowIndex, colIndex, isAnvil)) {
          const newCircleDiv = document.createElement("div");
          newCircleDiv.classList.add("circle");
          if (isAnvil) {
            circles[rowIndex][colIndex] = 1;
            newCircleDiv.classList.add("anvil");
          } else {
            circles[rowIndex][colIndex] = 2;
          }
          cellDiv.appendChild(newCircleDiv);
        }
      }
    });
  }

  function isValidCircle(rowIndex, colIndex, isAnvil) {
    if (isAnvil) {
      return (
        rowIndex + 1 == grid.length ||
        grid[rowIndex + 1][colIndex] == -1 ||
        circles[rowIndex + 1][colIndex] != 0
      );
    } else {
      return (
        rowIndex == 0 ||
        grid[rowIndex - 1][colIndex] == -1 ||
        circles[rowIndex - 1][colIndex] != 0
      );
    }
  }

  function isSolved(grid, circles) {
    let groups = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        let circle = circles[rowIndex][colIndex];
        if (groups[cell] === undefined) {
          groups[cell] = [];
        }
        if (circle != 0) {
          groups[cell].push(circles[rowIndex][colIndex]);
        }
      });
    });
    return groups.every(
      (group) => group.length == 2 && group.includes(1) && group.includes(2)
    );
  }
}
