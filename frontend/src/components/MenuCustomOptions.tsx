import { Text } from 'react-native'
import { MenuOption, MenuOptions } from 'react-native-popup-menu'
import { MenuItem } from '@/types/menu'
interface MenuCustomOptionsProps {
  menuList: MenuItem[]
}

const MenuCustomOptions = ({ menuList }: MenuCustomOptionsProps) => {
  return (
    <MenuOptions>
      {menuList.map((menuItem: MenuItem) => (
        <MenuOption
          onSelect={menuItem.onSelect}
          disabled={menuItem.disabled}>
          <Text style={{ color: menuItem.color }}>{menuItem.title}</Text>
        </MenuOption>
      ))}
    </MenuOptions>
  )
}
export default MenuCustomOptions
