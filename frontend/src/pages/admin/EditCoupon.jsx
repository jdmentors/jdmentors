import { useParams } from "react-router";
import { AdminContainer, AddCouponForm, AdminSidebar } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";

function EditCoupon() {
    const { couponId } = useParams();
    const [coupon, setCoupon] = useState(null);

    useEffect(() => {
        const getACoupon = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/single/${couponId}`);

                if (data && data.success) {
                    setCoupon(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getACoupon();
    }, [couponId])

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Edit a Coupon</h2>
                    <p className="text-gray-600">Edit an existing coupon by updating discounts, expiration, and usage to keep promotions effective and aligned with your platform’s goals.</p>
                </div>

                <div className="my-10 max-w-full">
                    {
                        coupon &&
                        <AddCouponForm coupon={coupon} />
                    }
                </div>
            </AdminContainer>
        </section>
    );
}

export default EditCoupon;