import Image from "next/image";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-10 py-10">
      {/* image color filter to multiply */}
      <Image
        src={"/images/closed.png"}
        alt="bookings"
        width={200}
        height={200}
        className="filter"
      />
      {/* apply cartoon style css */}
      <div className="text-center text-2xl font-bold text-primary/50">
        404 - Page Not Found
      </div>
    </div>
  );
};

export default NotFound;
