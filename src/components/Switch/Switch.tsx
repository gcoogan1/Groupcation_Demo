import { useState } from "react";
import { Checkbox, Slider, SwitchContainer } from "./Switch.styles";

interface SwitchProps {
  on?: boolean,
  onClick?: () => void
}

const Switch: React.FC<SwitchProps> = ({ on, onClick }) => {
  const [isOn, setIsOn] = useState(on);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
    if (onClick) onClick();
  };

  return (
    <SwitchContainer>
      <Checkbox type="checkbox" checked={isOn} onChange={handleToggle} />
      <Slider isOn={isOn} />
    </SwitchContainer>
  );
};

export default Switch;
