const Loader = (props) => {
    return (
      <>
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="w-max">{props.text}</div>
          <div className="w-10 h-10 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        </div>
      </>
    );
  };
  export default Loader;