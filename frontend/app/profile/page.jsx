"use client";

import React, { useEffect, useState } from 'react'
import UserLayout from '../../src/layout/UserLayout/UserLayout';
import DashboardLayout from '../../src/layout/DashboardLayout/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '../../src/config/redux/action/authAction';
import styles from "./page.module.css";
import clientServer, { BASE_URL } from '../../src/config';
import { useParams } from 'next/navigation';
import { getAllPosts } from "@/src/config/redux/action/postAction";

export default function ProfilePage() {

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const postReducer = useSelector((state) => state.postReducer);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
    const [inputData, setInputData] = useState({ company: '', position:'', years:''});
    const [educationInput, setEducationInput] = useState({school: '', degree: '', fieldOfStudy: ''});

    const handleInputWorkChange = (e) => {
        const { name, value } = e.target;
        setInputData({...inputData, [name]: value});
    }

    const handleEducationChange = (e) => {
        const { name, value } = e.target;
        setEducationInput({ ...educationInput, [name]: value });
    };



    useEffect(() => {
        dispatch(getAboutUser({token: localStorage.getItem("token")}));
        dispatch(getAllPosts());
    },[]);

    useEffect(() => {
        setUserProfile(authState.user)
    }, [authState.user]);

    useEffect(() => {
        if(authState.user != undefined){
            setUserProfile(authState.user);

            let post = postReducer.posts.filter((post) => {
                return post.userId.username === authState.user.userId.username
            });
            setUserPosts(post);
        }
    },[authState.user, postReducer.posts]);

    const updateProfilePicture = async(file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }

    const updateProfileData = async() => {
        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name,
        });

        const response = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork:  userProfile.pastWork,
            education: userProfile.education 

        });

        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }

  return (
    <UserLayout>
        <DashboardLayout>
            {authState.user && userProfile && userProfile.userId &&
            <div className={styles.container}>
                                <div className={styles.backDropContainer}>
                                    <label htmlFor='profilePictureUpload' className={styles.backDrop_overlay}>
                                        <p>
                                            Edit
                                        </p>
                                    </label>
                                    <input onChange={(e) => {
                                        updateProfilePicture(e.target.files[0]);
                                    }} hidden type='file' id='profilePictureUpload'/>
                                    <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt='backDrop'/>
                                </div>
            
                                <div className={styles.profileContainer_details}>
                                    <div style={{ display: "flex", gap: "0.7rem"}}>
                                        <div style={{ flex: "0.8"}}>
                                            <div style={{display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}}>
                                                <input className={styles.nameEdit} type='text' value={userProfile.userId.name} onChange={(e) => {
                                                    setUserProfile({...userProfile, userId: {...userProfile.userId, name: e.target.value}});
                                                }}/>
                                                <p style={{ color: "grey"}}>@{userProfile.userId.username}</p>
                                            </div>
            
                                            <div className={styles.bioSection}>
                                                <h3 className={styles.bioTitle}>About</h3>
                                                <textarea
                                                className={styles.bioTextarea}
                                                value={userProfile.bio}

                                                onChange={(e) => {
                                                    setUserProfile({...userProfile, bio: e.target.value});
                                                }}
                                                rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                                                style={{width: "100%"}}
                                                placeholder='Write something about yourself...'
                                                ></textarea>
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

                                        <button className={styles.addWorkButton} onClick={() => {
                                            setIsModalOpen(true);
                                        }}>Add Work</button>
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

                                            <button className={styles.addWorkButton} onClick={() => {
                                                setIsEducationModalOpen(true);
                                            }}>Add Education</button>
                                        </div>
                                </div>

                                <div style={{ flex: "0.2" }} className={styles.activity}>
                                    <h3>Recent Activity</h3>

                                    {userPosts.length === 0 ? (
                                        <p className={styles.noActivity}>
                                            No recent activity yet
                                        </p>
                                        ) : (
                                        userPosts.map((post) => {
                                            return (
                                                <div key={post._id} className={styles.postCard}>
                                                    <div className={styles.card}>
                                                        <div className={styles.card_profileContainer}>
                                                            {post.media !== "" ? (
                                                                <img src={`${BASE_URL}/${post.media}`} alt="posts" />
                                                            ) : (
                                                                <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                                                            )}
                                                        </div>

                                                        <p>{post.body}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {
                                    userProfile != authState.user &&
                                    <div onClick={() => {
                                        updateProfileData();
                                    }} className={styles.updateProfileBtn}>
                                        Update Profile
                                    </div>
                                }
                            </div>
            }


                        {
                          isModalOpen &&
                          <div onClick={() => {
                            setIsModalOpen(false);
                          }} className={styles.commentsContainer}>
                            <div onClick={(e) => {
                              e.stopPropagation();
                            }} className={styles.allCommentsContainer}>
                                <input onChange={handleInputWorkChange} name='company' className={styles.inputField} type='text' placeholder='Enter Company'/>
                                <input onChange={handleInputWorkChange} name='position' className={styles.inputField} type='text' placeholder='Enter Position'/>
                                <input onChange={handleInputWorkChange} name='years' className={styles.inputField} type='number' placeholder='Years'/>

                                <div onClick={() => {
                                    setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, inputData]});
                                    setIsModalOpen(false);
                                }} className={styles.updateProfileBtn}>Add Work</div>
                            </div>
                          </div>
                        }

                        {
                            isEducationModalOpen &&
                            <div onClick={() => {
                                setIsEducationModalOpen(false);
                            }} className={styles.commentsContainer}>
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                }} className={styles.allCommentsContainer}>
                                    <input onChange={handleEducationChange} name='school' className={styles.inputField} type='text' placeholder='Enter School / College'/>
                                    <input onChange={handleEducationChange} name='degree' className={styles.inputField} type='text' placeholder='Enter Degree'/>
                                    <input onChange={handleEducationChange} name='fieldOfStudy' className={styles.inputField} type='text' placeholder='Field Of Study'/>

                                    <div onClick={() => {
                                        setUserProfile({...userProfile, education: [...userProfile.education, educationInput]});
                                        setIsEducationModalOpen(false);
                                    }} className={styles.updateProfileBtn}>Add Education</div>
                                </div>
                            </div>
                        }
        </DashboardLayout>
    </UserLayout>
  )
}
