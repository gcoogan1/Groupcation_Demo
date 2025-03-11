import { useState } from "react";
import { Checkbox, Slider, SwitchContainer } from "./Switch.styles";

interface SwitchProps {
  on?: boolean
}

const Switch: React.FC<SwitchProps> = ({ on }) => {
  const [isOn, setIsOn] = useState(on);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <SwitchContainer>
      <Checkbox type="checkbox" checked={isOn} onChange={handleToggle} />
      <Slider isOn={isOn} />
    </SwitchContainer>
  );
};

export default Switch;
