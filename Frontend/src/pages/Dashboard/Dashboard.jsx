import Spinner from "@/custom-components/Spinner";
import {
  clearAllSuperAdminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "@/store/slices/superAdminSlice";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentGraph from "./sub-components/PaymentGraph";
import BiddersAuctioneersGraph from "./sub-components/BiddersAuctioneersGraph";
import PaymentProofs from "./sub-components/PaymentProofs";
import AuctionItemDelete from "./sub-components/AuctionItemDelete";

const Dashboard = () => {
  const { loading } = useSelector((state) => state.superAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(clearAllSuperAdminSliceErrors());
  }, []);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (user.role !== "Super Admin" || !isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="w-full gap-7 ml-0 m-0 h-fit px-5 pt-10 lg:pl-[320px] flex flex-col gap-10">
            <h1 className="text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl">
              Dashboard
            </h1>
            <div className="flex flex-col gap-10">
              <h3
                className={`text-black text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl`}
              >
                Monthly Total Payment Received
              </h3>
              <PaymentGraph />
            </div>

            <div className="flex flex-col gap-10">
              <h3
                className={`text-black text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl`}
              >
                Users
              </h3>
              <BiddersAuctioneersGraph />
            </div>

            <div className="flex flex-col gap-10">
              <h3
                className={`text-black text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl`}
              >
                Payment Proofs
              </h3>
              <PaymentProofs />
            </div>

            <div className="flex flex-col gap-10">
              <h3
                className={`text-black text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl`}
              >
                Delete Items From Auction
              </h3>
              <AuctionItemDelete />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
