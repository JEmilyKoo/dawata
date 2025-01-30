declare module "*.svg" {
  import { SvgProps } from "react-native-svg"
  const content: (props: SvgProps) => JSX.Element
  export default content
}
