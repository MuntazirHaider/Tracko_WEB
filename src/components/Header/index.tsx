import React from 'react'

type Props = {
  title: string;
  buttonComponent?: any;
  isSmallText?: boolean;
}

const Header = ({ title, buttonComponent, isSmallText = false }: Props) => {
  return (
    <div className='mb-5 flex w-full items-center justify-between'>
      <h1 className={`${isSmallText ? 'text-lg' : 'text-2xl'} font-semibold dark:text-white`}>
        {title}
      </h1>
      {buttonComponent}
    </div>
  )
}

export default Header