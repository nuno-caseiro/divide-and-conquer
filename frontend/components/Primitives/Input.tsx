import React from "react";
import { useFormContext } from "react-hook-form";
import { css } from "@stitches/react";
import Text from "./Text";
import { CSS, styled } from "../../stitches.config";
import Flex from "./Flex";
import isEmpty from "../../utils/isEmpty";
import InfoIcon from "./icons/info";
import { outlineColor, outlineFocus } from "../../styles/colors/outline.colors";
import { boxShadow, boxShadowFocus } from "../../styles/colors/box-shadow.colors";

const StyledInput = styled("input", {
  // Reset
  appearance: "none",
  borderWidth: "0",
  boxSizing: "border-box",
  margin: "0",
  outlineOffset: "0",
  padding: "0",
  fontFamily: "DM Sans",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  backgroundColor: "$white",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },
  "&:-internal-autofill-selected": {
    "-webkit-box-shadow": "0 0 0px 1000px white inset",
    backgroundColor: "$white",
  },

  "&:-webkit-autofill,&:-webkit-autofill:active,&:-webkit-autofill:focus": {
    "-webkit-box-shadow": "0 0 0px 1000px white inset",
    backgroundColor: "$white",
  },

  "&:-webkit-autofill::first-line": {
    color: "$dangerBase",
    fontFamily: "DM Sans",
    fontSize: "$16",
    fontWeight: "$bold",
  },

  // Custom

  display: "flex",
  fontSize: "$16",
  px: "$16",
  boxShadow: "0",
  border: "1px solid $primary200",
  outline: "none",
  borderRadius: "$4",
  lineHeight: "$20",
  pt: "$28",
  pb: "$8",
  "&::-webkit-input-placeholder": {
    color: "$primary300",
  },
  "&:disabled": {
    backgroundColor: "$primary50",
  },
  variants: {
    variant: {
      default: {
        "&:focus": {
          borderColor: "$primary400",
          boxShadow: "0px 0px 0px 2px var(--colors-primaryLightest)",
        },
      },
      valid: {
        borderColor: "$success700",
        boxShadow: "0px 0px 0px 2px var(--colors-successLightest)",
      },
      error: {
        borderColor: "$danger700",
        boxShadow: "0px 0px 0px 2px var(--colors-dangerLightest)",
      },
    },
  },
  color: "$primaryBase",
  "&::placeholder": {
    "&:disabled": {
      color: "$primaryBase",
    },
    color: "$primary300",
  },
});

interface InputProps {
  id: string;
  type: "text" | "password" | "email" | "number" | "tel" | "url";
  placeholder: string;
  // value?: string;
  icon?: JSX.Element;
  helperText?: string;
  iconPosition?: "left" | "right";
  customCss?: CSS;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  icon,
  iconPosition,
  helperText,
  type,
  customCss,
  disabled,
}) => {
  Input.defaultProps = {
    iconPosition: "left",
    icon: undefined,
    helperText: "",
    customCss: undefined,
    disabled: false,
  };

  const isIconLeft = iconPosition === "left";
  const isIconRight = iconPosition === "right";

  const values = useFormContext();
  const {
    formState: { errors },
  } = values;
  const isValueEmpty = isEmpty(values.getValues()[id]);
  const state = errors[`${id}`] ? "error" : isValueEmpty ? "default" : "valid";
  return (
    <Flex
      direction="column"
      css={{ position: "relative", width: "100%", mb: "$20", height: "auto", ...customCss }}
      onBlur={() => {
        if (isValueEmpty) values.clearErrors();
      }}
    >
      {!!icon && (
        <Flex
          css={{
            ...css,
            position: "absolute",
            top: "$16",
            left: isIconLeft ? "$16" : "undefined",
            right: isIconRight ? "$16" : "undefined",
          }}
        >
          {icon}
        </Flex>
      )}
      <Flex>
        <StyledInput
          id={id}
          placeholder=" "
          disabled={disabled}
          type={type}
          variant={state}
          data-state={state}
          data-icon-position={iconPosition}
          css={{
            height: "$56",
            width: "100%",
            "&:not(:placeholder-shown) ~ label": {
              transform: `scale(0.875) translateX(${
                icon && isIconLeft ? "0.5rem" : "0.1rem"
              }) translateY(-0.5rem)`,
            },
            "&:focus ~ label": {
              transform: `scale(0.875) translateX(${
                icon && isIconLeft ? "0.5rem" : "0.1rem"
              }) translateY(-0.5rem)`,
            },
            pl: icon && isIconLeft ? "$56" : "$16",
            pr: icon && iconPosition === "right" ? "$56" : "$16",
          }}
          {...values?.register(id)}
        />
        <Text
          as="label"
          htmlFor={id}
          css={{
            fontSize: "$16",
            p: "$16",
            pl: icon && isIconLeft ? "$57" : "$17",
            top: "0",
            lineHeight: "$24",
            color: "$primary300",
            position: "absolute",
            pointerEvents: "none",
            transformOrigin: "0 0",
            transition: "all .2s ease-in-out",
          }}
        >
          {placeholder}
        </Text>
      </Flex>

      <Flex
        gap="4"
        align="center"
        css={{
          mt: "$8",
          "& svg": {
            height: "$16 !important",
            width: "$16 !important",
            color: "$dangerBase",
          },
        }}
      >
        {state === "error" && <InfoIcon />}
        <Text
          css={{
            color: state === "error" ? "$dangerBase" : "$primary300",
          }}
          hint
        >
          {!isEmpty(helperText) ? helperText : errors[`${id}`]?.message}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Input;
