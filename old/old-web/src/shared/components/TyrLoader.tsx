import rabbitLoader from 'src/assets/images/rabbit-loader.gif';

// eslint-disable-next-line
const TYRLoader = ({ height }: any) => {

  return (
    <div
      style={{
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img style={{ height: '80px' }} alt="loader" src={rabbitLoader} />
    </div>
  );
};
export default TYRLoader;
