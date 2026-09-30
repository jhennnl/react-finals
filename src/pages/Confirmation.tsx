import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Confirmation() {
  usePageTitle("Order Confirmation");

  return (
    <section className="py-20">
      <div className="page-shell max-w-2xl">
        <div className="rounded-[30px] bg-[#e4eee0] p-8 text-center md:p-12">
          <p className="section-label">ORDER RECEIVED</p>
          <h1 className="mt-4 font-display text-5xl">Your cake is on its way.</h1>
          <p className="mx-auto mt-5 max-w-lg leading-7 text-[#49675f]">
            Your order has been submitted and is now waiting for confirmation.
          </p>

          <div className="mx-auto mt-9 max-w-md rounded-[22px] bg-white p-6 text-left shadow-sm">
            <div className="flex justify-between border-b border-[#eadde2] pb-4">
              <span className="text-sm text-[#786a76]">Order number</span>
              <strong>#CC-1029</strong>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-sm text-[#786a76]">Status</span>
              <span className="pill bg-[#f3d99a] text-[#8a6810]">Pending</span>
            </div>
            <div className="flex justify-between border-t border-[#eadde2] pt-4">
              <span className="text-sm text-[#786a76]">Estimated total</span>
              <strong>₱1,470</strong>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/orders" className="btn-primary">View my orders</Link>
            <Link to="/cakes" className="btn-secondary">Browse more cakes</Link>
          </div>
        </div>
      </div>
    </section>
  );
}