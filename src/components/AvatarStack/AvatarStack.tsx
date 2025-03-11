import { avatarTheme } from "../../styles/theme";
import Avatar from "../Avatar/Avatar";
import { AvatarStackContainer } from "./AvatarStack.styles";

type AvatarThemeKeys = keyof typeof avatarTheme;

type Traveler = {
  initials: string;
  color: AvatarThemeKeys;
};

interface AvatarStackProps {
  travelers: Traveler[];
  onClick: () => void;
}

const AvatarStack: React.FC<AvatarStackProps> = ({ travelers, onClick }) => {
  const greaterThanFive = travelers.length > 5;
  const displayedTravelers = greaterThanFive ? travelers.slice(0, 4) : travelers;
  const remainingTravelers = travelers.length - displayedTravelers.length;

  return (
    <AvatarStackContainer onClick={onClick}>
      {displayedTravelers.map((traveler, index) => (
        <Avatar
          key={index}
          color={traveler.color}
          initials={traveler.initials}
        />
      ))}
      {greaterThanFive && (
        <Avatar color="gray" initials={`+${remainingTravelers}`} />
      )}
    </AvatarStackContainer>
  );
};

export default AvatarStack;
