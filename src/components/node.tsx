export const Node = ({ node, exitFn }: { node: any; exitFn: Function }) => {
  const string = JSON.stringify(node, null, 2);
  return (
    <div className="w-[600px] text-wrap text-gray-400">
      <button onClick={() => exitFn()}>X</button>

      <pre> {string}</pre>
    </div>
  );
};
