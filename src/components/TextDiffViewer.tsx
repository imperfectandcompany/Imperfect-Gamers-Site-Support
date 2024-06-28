function findDifferences(oldText: string, newText: string) {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    let diffResults: { line: number; diffs: { index: number; type: string; oldValue: any; newValue: any; }[]; }[] = [];
  
    oldLines.forEach((oldLine, index) => {
      const newLine = newLines[index] || '';
      if (oldLine !== newLine) {
        const charDiffs = compareLines(oldLine, newLine);
        diffResults.push({ line: index + 1, diffs: charDiffs });
      }
    });
  
    return diffResults;
  }
  
  function compareLines(oldLine: string | any[], newLine: string | any[]) {
    const length = Math.max(oldLine.length, newLine.length);
    let differences = [];
  
    for (let i = 0; i < length; i++) {
      if (oldLine[i] !== newLine[i]) {
        const changeType = !oldLine[i] ? 'added' : !newLine[i] ? 'removed' : 'changed';
        differences.push({ index: i, type: changeType, oldValue: oldLine[i], newValue: newLine[i] });
      }
    }
  
    return differences;
  }

  interface TextDiffViewerProps {
    oldText: string;
    newText: string;
  }
  
  export const TextDiffViewer = ({ oldText, newText }: TextDiffViewerProps) => {
    const diffs = findDifferences(oldText, newText);
  
    return (
      <div>
        {diffs.map((diff) => (
          <div key={diff.line}>
            Line {diff.line}: {diff.diffs.map((d) =>
              <span
                style={{ backgroundColor: getColor(d.type) }}
                key={d.index}
              >
                {d.type === 'removed' ? d.oldValue : d.newValue}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  function getColor(type: string): string {
    switch (type) {
      case 'added': return 'lightgreen';
      case 'removed': return 'salmon';
      case 'changed': return 'lightyellow';
      default: return 'transparent';
    }
  }
  