import { theme } from "../../styles/theme";
import { BottomLine, GRouteContainer, TopLine } from "./GraphicRoute.styles";

type ThemeKeys = keyof typeof theme;

interface GraphicRouteProps {
  type: ThemeKeys;
  children: React.ReactNode;
}

const GraphicRoute: React.FC<GraphicRouteProps> = ({ type, children }) => {
  return (
    <GRouteContainer>
      <TopLine type={theme[type] || theme.primary} />
      {children}
      <BottomLine type={theme[type] || theme.primary} />
    </GRouteContainer>
  )
}

export default GraphicRoute