"use client";

import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import clientServer, { BASE_URL } from '../../../src/config';
import DashboardLayout from '../../../src/layout/DashboardLayout/Dashboard';
import UserLayout from '../../../src/layout/UserLayout/UserLayout';
import styles from './page.module.css';
import { useDispatch, useSelector } from 'react-redux';
import postReducer from "@/src/config/redux/reducer/postReducer/index.js"; 
import { getAllPosts } from "@/src/config/redux/action/postAction";
import { getConnectionsRequest, getMyConnectionRequest, sendConnectionRequest } from '../../../src/config/redux/action/authAction';

export default function ViewProfilePage() {
    const {username} = useParams();
    const [userProfile, setUserProfile] = useState("");
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.postReducer);

    const [userPosts, setUserPosts] = useState([]);
    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

    const [isConnectionNull, setIsConnectionNull]  = useState(true);

    const getUsersPosts = async() => {
        await dispatch(getAllPosts());
        await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
        await dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));
    }

    useEffect(() => {
        if (!postState.posts || !username) return;

        let post = postState.posts.filter((post) =>  {
            return post.userId?.username === username
        });

        setUserPosts(post);
    },[postState.posts, username]);


    useEffect(() => {
        if (
            !userProfile ||
            !userProfile.userId ||
            !authState.connections
        ) return;

        console.log(authState.connections, userProfile.userId._id);
        if(authState.connections.some(user => user.connectionId._id === userProfile.userId._id)){
            setIsCurrentUserInConnection(true);
            if(authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true){
                setIsConnectionNull(false);
            }
        }

        if(authState.ConnectionRequest.some(user => user.userId._id === userProfile.userId._id)){
            setIsCurrentUserInConnection(true);
            if(authState.ConnectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true){
                setIsConnectionNull(false);
            }
        }
    }, [authState.connections]);



    useEffect(() => {
        getUsersPosts();
    },[]);


    useEffect(() => {
        if(!username) return;
        clientServer.get("/user/get_profile_based_on_username", {
            params: {username},
        })
        .then((res) => {
            // console.log("PROFILE:", res.data.profile);
            setUserProfile(res.data.profile);
        })
        .catch((error) => {
            console.error(error);
        })
        console.log("From view: view profile")
    }, [username]);

    if(!userProfile) {
        return <div>Loading...</div>;
    }

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <div className={styles.backDropContainer}>
                        <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt='backDrop'/>
                    </div>

                    <div className={styles.profileContainer_details}>
                        <div style={{ display: "flex", gap: "0.7rem"}}>
                            <div style={{ flex: "0.8"}}>
                                <div style={{display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}}>
                                    <h2>{userProfile.userId.name}</h2>
                                    <p style={{ color: "grey"}}>@{userProfile.userId.username}</p>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "1rem"}}>
                                    { isCurrentUserInConnection ?
                                        <button className={styles.connectedBtn}>{isConnectionNull? "Pending" : "Connected"}</button>
                                        :
                                        <button onClick={() => {
                                            dispatch(sendConnectionRequest({ token: localStorage.getItem('token'), user_id: userProfile.userId._id}));
                                            // setIsCurrentUserInConnection(true);
                                        }} className={styles.connectBtn}>Connect</button>
                                    }

                                    <div onClick={async() => {
                                        const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                                        window.open(`${BASE_URL}/${response.data.message}`, "_blank");
                                    }} style={{cursor: "pointer"}}>
                                        <svg style={{ width: "1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>

                                    </div>
                                </div>

                                <div className={styles.bioSection}>
                                    <h3 className={styles.bioTitle}>About</h3>
                                    <p className={styles.bioTextarea}>{userProfile.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className={styles.workHistory}>
                        <h3>Work History</h3>

                        <div className={styles.workHistoryContainer}>
                            {
                                userProfile.pastWork.map((work, index) => {
                                    return (
                                        <div key={index} className={styles.workHistoryCard}>
                                            <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>{work.company} - {work.position}</p>
                                            <p>{work.years} years</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className={styles.education}>
                        <h3>Education</h3>

                        <div className={styles.educationContainer}>

                            {
                                userProfile.education.map((edu, index) => {
                                    return(
                                        <div  key={index} className={styles.educationCard}>
                                            <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>{edu.school}</p>
                                            <p>{edu.degree} - {edu.fieldOfStudy}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div style={{flex: "0.2"}} className={styles.activity}>
                        <h3>Recent Activity</h3>
                        {userPosts.map((post) => {
                            return(
                                <div key={post._id} className={styles.postCard}>
                                    <div className={styles.card}>
                                        <div className={styles.card_profileContainer}>
                                            {post.media !== "" ?  <img src={`${BASE_URL}/${post.media}`} alt='posts'/>
                                            : 
                                            <div style={{ width: "3.4rem", height: "3.4rem"}}></div>}
                                        </div>

                                        <p>{post.body}</p>
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

// export async function getServerSideProps(context) {
//     const request = await clientServer.get("/user/get_profile_based_on_username", {
//         params: {
//             username: context.query.username
//         }
//     });

//     const response = await request.data;
//     console.log(response);

//     return { props: {userProfile: request.data.profile}};
// };