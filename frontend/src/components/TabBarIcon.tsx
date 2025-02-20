import { SvgProps } from "react-native-svg"

interface TabBarIconProps {
  Icon: React.ComponentType<SvgProps>
  color: string
}

export default function TabBarIcon({ Icon, color }: TabBarIconProps) {
  return (
    <Icon
      width={24}
      height={24}
      stroke={color}
      strokeWidth={2}
    />
  )
}
