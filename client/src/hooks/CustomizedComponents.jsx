import { Button, ButtonBase, styled } from "@mui/material";
import { yellow } from "@mui/material/colors";

const CustomizedComponents = () => {
  const MenuItemButton = styled(Button)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[500]}`,
    backgroundColor: `${theme.palette.grey[50]}`,
    "&:hover, ": {
      zIndex: 1,
    },
    "&.Selected": { backgroundColor: yellow[500] },
  }));
  return { MenuItemButton };
};

export default CustomizedComponents;
