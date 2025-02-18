import { StyleSheet, Text } from 'react-native'
import { MenuOption, MenuOptions } from 'react-native-popup-menu'

import Colors from '@/constants/Colors'
import { MenuItem } from '@/types/menu'

interface MenuCustomOptionsProps {
  menuList: MenuItem[]
}

const styles = StyleSheet.create({
  normal: {
    borderBottomColor: Colors.bord,
    borderBottomWidth: 1,
    height: 44,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  last: {
    height: 44,
    justifyContent: 'center',
    paddingLeft: 16,
  },
})

const MenuCustomOptions = ({ menuList }: MenuCustomOptionsProps) => {
  return (
    <MenuOptions>
      {menuList.map((menuItem: MenuItem, index) => (
        <MenuOption
          key={index}
          onSelect={menuItem.onSelect}
          disabled={menuItem.disabled}
          style={menuList.length == index + 1 ? styles.last : styles.normal}>
          <Text
            style={{ color: menuItem.color }}
            className="text-base">
            {menuItem.title}
          </Text>
        </MenuOption>
      ))}
    </MenuOptions>
  )
}
export default MenuCustomOptions
