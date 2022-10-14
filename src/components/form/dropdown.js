import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from "rc-menu";
import "rc-dropdown/assets/index.css";

const DropdownButton = (props) => {
  const { list = [] } = props;
  const menu = (
    <Menu multiple onSelect={props.setSelected}>
      {list.map((item, index) => {
        return <MenuItem key={index}>{item}</MenuItem>;
      })}
    </Menu>
  );
  return (
    <Dropdown
      openClassName={props.className}
      overlay={menu}
      trigger={["click"]}
      closeOnSelect={true}
    >
      {props.children}
    </Dropdown>
  );
};

export default DropdownButton;
