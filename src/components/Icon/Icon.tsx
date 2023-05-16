import { FC, ReactElement } from "react";

type iconPropsType = {
	name: string;
};

const Icon: FC<iconPropsType> = ({ name }: iconPropsType): ReactElement => {
	return <ion-icon name={name}></ion-icon>;
};

export default Icon;
