function CarImage({ params }) {
  return (
    <img
      src={params.formattedValue}
      alt="Car ID"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "100%",
        objectFit: "cover",
        margin: "0 auto",
      }}
    />
  );
}

export default CarImage;
