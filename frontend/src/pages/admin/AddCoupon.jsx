import { AdminContainer, AddCouponForm, AdminSidebar } from "../../components";

function AddService(){    
    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Add a Coupon</h2>
                    <p className="text-gray-600">Define and launch a new coupon by setting discounts, usage limits, and expiration to drive engagement and reward your users.  </p>
                </div>

                <div className="my-10 max-w-full">
                    <AddCouponForm />
                </div>
            </AdminContainer>
        </section>
    );
}

export default AddService;