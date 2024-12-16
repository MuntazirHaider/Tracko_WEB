import HashLoader from "react-spinners/HashLoader";


function Loading() {
  return (
    <div className="sweet-loading flex items-center justify-center w-full h-full">
        <HashLoader
           color="#367ae0"
           size={50}
        />
    </div>
  );
}

export default Loading;