"use client";

import React, { useEffect } from 'react';
import UserLayout from '../../src/layout/UserLayout/UserLayout';
import DashboardLayout from '../../src/layout/DashboardLayout/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../src/config/redux/action/authAction';
import styles from './page.module.css';
import { BASE_URL } from '../../src/config';
import { useRouter } from 'next/navigation';

export default function DiscoverPage() {

  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers());
    }
  },[]);

  const router = useRouter();
  return (
    <UserLayout>

      <DashboardLayout>
        <div>
          <h1 className={styles.heading}>Discover</h1>

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched && authState.all_users.map((user) => {
              return(
                <div onClick={() => {
                  router.push(`/view_profile/${user.userId.username}`);
                }} key={user._id} className={styles.userCard}>
                  <div className={styles.avatar}>
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profilePicture"/>
                  </div>
                  <div>
                    <h1>{user.userId.name}</h1>
                    <p>{user.userId.username}</p>
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </DashboardLayout>
      


    </UserLayout>
  )
}
