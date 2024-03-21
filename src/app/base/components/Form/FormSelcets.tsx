import React, { FunctionComponent } from 'react'
import Select, { Props as DefaultProps, StylesConfig } from 'react-select'

const reactSelectStyles: StylesConfig<any> | undefined = {
  // @ts-ignore
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  // @ts-ignore
  placeholder: (base) => ({
    ...base,
    color: '#a4a4a4',
  }),
}

interface OwnProps extends DefaultProps {}

type Props = OwnProps

const FormSelect: FunctionComponent<Props> = (props: Props) => {
  return (
    <>
      <Select
        className={'formSelect'}
        styles={reactSelectStyles}
        menuPosition={'fixed'}
        {...props}
      />
    </>
  )
}

export default FormSelect
