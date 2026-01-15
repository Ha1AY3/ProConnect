"use client";

import React, { useEffect } from 'react'
import UserLayout from '../../src/layout/UserLayout/UserLayout';
import DashboardLayout from '../../src/layout/DashboardLayout/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { acceptConnnection, getMyConnectionRequest } from '../../src/config/redux/action/authAction';
import { BASE_URL } from '../../src/config';
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));
  },[]);

  useEffect(() => {
    if(authState.ConnectionRequest.length != 0){
      console.log(authState.ConnectionRequest);
    }
  }, [authState.ConnectionRequest]);

  // console.log(authState.ConnectionRequest);


  return (
    <UserLayout>

      <DashboardLayout>
        <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>

          <h4>My Connections</h4>
          {
            authState.ConnectionRequest.length === 0 && <h1>No Connection Request</h1>
          }

          {
            authState.ConnectionRequest.length != 0 && authState.ConnectionRequest.filter((connection) => connection.status_accepted === false).map((user, index) => {
              return(
                <div onClick={() => {
                  router.push(`view_profile/${user.userId.username}`);
                }} className={styles.userCard} key={index}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", width: "100%"}}>
                    <div className={styles.profilePicture}>
                      <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt=''/>
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>
                    </div>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      dispatch(acceptConnnection({
                        connectionId: user._id,
                        token: localStorage.getItem("token"),
                        action: "accept"
                      }))
                    }} className={styles.connectedBtn}>Accept</button>
                  </div>
                </div>
              )
            })
          }

          <h4>My Network</h4>
          {authState.ConnectionRequest.filter((connection) => connection.status_accepted !== false).map((user, index) => {
            return (
              <div onClick={() => {
                  router.push(`view_profile/${user.userId.username}`);
                }} className={styles.userCard} key={index}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem"}}>
                    <div className={styles.profilePicture}>
                      <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt=''/>
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>
                    </div>
                  </div>
                </div>
            )
          })}
        </div>
      </DashboardLayout>
      


    </UserLayout>
  )
}
