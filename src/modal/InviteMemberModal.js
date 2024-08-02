import React, { useState } from "react";
import axios from "axios";
import "../style/InviteMemberModal.css";

const InviteMemberModal = ({ show, onClose, planId }) => {
    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [addedUsers, setAddedUsers] = useState([]);
    const [error, setError] = useState(null);

    if (!show) {
        return null;
    }

    const handleSearch = async () => {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        try {
            const response = await axios.get(
                `http://localhost:8080/members/search/${keyword}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("검색 결과 :", response.data);
            setSearchResults(response.data);
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.warn("Access token expired, attempting refresh...");

                try {
                    console.log("refreshToken", refreshToken);
                    const refreshResponse = await axios.post("http://localhost:8080/auth/refresh", {
                        refreshToken: refreshToken
                    });

                    const newAccessToken = refreshResponse.data;
                    localStorage.setItem("token", newAccessToken);

                    const retryResponse = await axios.get(
                        `http://localhost:8080/members/search/${keyword}`,
                        {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );
                    console.log("검색 결과 :", retryResponse.data);
                    setSearchResults(retryResponse.data);
                } catch (refreshError) {
                    console.error("토큰 갱신 중 오류 발생:", refreshError);
                }
            } else {
                console.error("Error searching members:", error);
                setError("사용자 검색에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    const handleAddUser = (user) => {
        if (user && !addedUsers.find((u) => u.id === user.id)) {
            setAddedUsers([...addedUsers, user]);
        }
    };

    const handleInvite = async () => {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        try {
            const response = await axios.post(
                `http://localhost:8080/plan/members/invite/${planId}`,
                { memberIds: addedUsers.map(user => user.id) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Invite response:", response.data);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.warn("Access token expired, attempting refresh...");

                try {
                    console.log("refreshToken", refreshToken);
                    const refreshResponse = await axios.post("http://localhost:8080/auth/refresh", {
                        refreshToken: refreshToken
                    });

                    const newAccessToken = refreshResponse.data;
                    localStorage.setItem("token", newAccessToken);

                    const retryResponse = await axios.post(
                        `http://localhost:8080/plan/members/invite/${planId}`,
                        { memberIds: addedUsers.map(user => user.id) },
                        {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );
                    console.log("Invite response:", retryResponse.data);
                    onClose();
                } catch (refreshError) {
                    console.error("토큰 갱신 중 오류 발생:", refreshError);
                }
            } else {
                console.error("요청 중 오류 발생:", error);
            }
        }
    };

    return (
        <div className="invitemembermodal">
            <div className="invitemembermodal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h1>새 멤버 초대</h1>
                {error && <p className="error">{error}</p>}
                <div className="user-search-section">
                    <input
                        type="text"
                        placeholder="사용자 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button className="user-search-btn" onClick={handleSearch}>검색</button>
                </div>
                <div className="user-search-results">
                    {searchResults.length > 0 && (
                        <ul>
                            {searchResults.map((result) => (
                                <li key={result.id}>
                                    {result.name}
                                    <button className="add-btn" onClick={() => handleAddUser(result)}>추가</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="added-ids-title">
                    <div>초대할 사용자</div>
                </div>
                <div className="added-ids">
                    {addedUsers.length > 0 && (
                        <ul>
                            {addedUsers.map((user) => (
                                <li key={user.id}>{user.name}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="inv-btn-wrap">
                    <button className="inv-btn" onClick={handleInvite}>초대</button>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberModal;
