import { useState } from "react";
import CustomizedComponents from "../hooks/CustomizedComponents";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router";

const ButtonsMenu = ({ items }) => {
  let navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  const { MenuItemButton } = CustomizedComponents();
  return (
    <Stack direction="row" spacing={2}>
      {items.map((item, indx) => (
        <MenuItemButton
          key={indx}
          className={indx === selected ? "Selected" : "none"}
          onClick={() => {
            setSelected(indx);
            navigate(item.navigate);
          }}
        >
          {item.title}
        </MenuItemButton>
      ))}
    </Stack>
  );
};

export default ButtonsMenu;
