const StayButton = (props) => {
  const { disableBtn, text } = props;

  return (
    <button onClick={props.onClick} disabled={disableBtn}>
      {text}
      {props.children}
    </button>
  );
};

export default StayButton;
