import { FC } from "react";

type iconPropsType = {
	name: string;
};

const CustomTag = `ion-icon` as keyof JSX.IntrinsicElements;

const Icon: FC<iconPropsType> = ({ name }) => {
	return <CustomTag name={name}></CustomTag>;
};

export default Icon;
