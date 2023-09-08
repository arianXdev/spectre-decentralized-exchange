type IconProps = {
	name: string;
};

const CustomTag = `ion-icon` as keyof JSX.IntrinsicElements;

const Icon = ({ name }: IconProps) => {
	return <CustomTag name={name}></CustomTag>;
};

export default Icon;
