//     <svg height="20em" id="figureA" xmlns="http://www.w3.org/2000/svg"></svg>

function plotSVGHorizontalAxis(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
  ): string {
    const result: string[] = [
      "<path",
      `d="M${fromX} ${fromY} L${toX} ${toY}"`,
      'stroke="red"',
      'stroke-width="2"',
      'fill="none"',
      "/>",
    ];
    return result.join(" ");
  }
  