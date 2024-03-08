import { Text as DefaultText } from "react-native"

type MontserratFontWeightNames =
  | "black"
  | "extrabold"
  | "bold"
  | "semibold"
  | "medium"
  | "regular"
  | "thin"
  | "light"
  | "extralight"

type MontserratFontTextProps = {
  family: "montserrat"
  italic?: true | undefined
  weight?: MontserratFontWeightNames | undefined
}

type RobotoFontWeightNames =
  | "thin"
  | "light"
  | "regular"
  | "medium"
  | "bold"
  | "black"

type RobotoFontTextProps = {
  family?: "roboto" | undefined
  italic?: true | undefined
  weight?: RobotoFontWeightNames | undefined
}

type TextProps = DefaultText["props"] &
  (RobotoFontTextProps | MontserratFontTextProps)

export function SansText(props: TextProps) {
  const { style, ...otherProps } = props

  if (props.family === "montserrat") {
    if (props.weight === "black") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic
                ? "Montserrat-BlackItalic"
                : "Montserrat-Black",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "extrabold") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic
                ? "Montserrat-ExtraBoldItalic"
                : "Montserrat-ExtraBold",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "bold") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic
                ? "Montserrat-BoldItalic"
                : "Montserrat-Bold",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "semibold") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic
                ? "Montserrat-SemiBoldItalic"
                : "Montserrat-SemiBold",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "medium") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic
                ? "Montserrat-MediumItalic"
                : "Montserrat-Medium",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "regular") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic ? "Montserrat-Italic" : "Montserrat",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "thin") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic
                ? "Montserrat-ThinItalic"
                : "Montserrat-Thin",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "light") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic
                ? "Montserrat-LightItalic"
                : "Montserrat-Light",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "extralight") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic
                ? "Montserrat-ExtraLightItalic"
                : "Montserrat-ExtraLight",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic ? "Montserrat-Italic" : "Montserrat",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    }
  } else if (props.family === "roboto" || props.family === undefined) {
    if (props.weight === "thin") {
      return (
        <DefaultText
          style={[
            { fontFamily: props.italic ? "Roboto-ThinItalic" : "Roboto-Thin" },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "light") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic ? "Roboto-LightItalic" : "Roboto-Light",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "regular") {
      return (
        <DefaultText
          style={[
            { fontFamily: props.italic ? "Roboto-Italic" : "Roboto" },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "medium") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic
                ? "Roboto-MediumItalic"
                : "Roboto-Medium",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "bold") {
      return (
        <DefaultText
          style={[
            { fontFamily: props.italic ? "Roboto-BlackItalic" : "Roboto-Bold" },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else if (props.weight === "black") {
      return (
        <DefaultText
          style={[
            {
              fontFamily: props.italic ? "Roboto-BlackItalic" : "Roboto-Black",
            },
            props.style,
          ]}
          {...otherProps}
        />
      )
    } else {
      return (
        <DefaultText
          style={[
            { fontFamily: props.italic ? "Roboto-Italic" : "Roboto" },
            props.style,
          ]}
          {...otherProps}
        />
      )
    }
  }

  return <DefaultText />
}
