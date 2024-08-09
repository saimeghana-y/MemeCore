import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { ethers } from 'ethers';
import { getMeme, getMemeComments, voteMeme, addComment, tipMeme } from '../../utils/memeExplorerContract';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function MemeDetail({ memeId }) {
  const { data: session } = useSession();
  const [meme, setMeme] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [tipAmount, setTipAmount] = useState('');

  useEffect(() => {
    loadMemeData();
  }, [memeId]);

  const loadMemeData = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const memeData = await getMeme(signer, memeId);
      const memeComments = await getMemeComments(signer, memeId);
      setMeme(memeData);
      setComments(memeComments);
    }
  };

  const handleVote = async (isUpvote) => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await voteMeme(signer, memeId, isUpvote);
      loadMemeData();
    }
  };

  const handleAddComment = async () => {
    if (typeof window.ethereum !== 'undefined' && newComment) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await addComment(signer, memeId, newComment);
      setNewComment('');
      loadMemeData();
    }
  };

  const handleTip = async () => {
    if (typeof window.ethereum !== 'undefined' && tipAmount) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await tipMeme(signer, memeId, tipAmount);
      setTipAmount('');
      loadMemeData();
    }
  };
  

  if (!meme) return <div>Loading...</div>;

  return (
    <div style={{ 
      color: '#333', 
      padding: '20px', 
      borderRadius: '12px', 
      backgroundColor: '#fff', 
      maxWidth: '600px', 
      margin: 'auto', 
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ 
        fontSize: '26px', 
        fontWeight: '600', 
        marginBottom: '20px', 
        color: '#1a1a1a' 
      }}>{meme.title}</h2>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        marginBottom: '20px' 
      }}>
        <button onClick={() => handleVote(true)} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          transition: 'transform 0.2s',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FaThumbsUp size={28} color="#4CAF50" />
          <span style={{ 
            marginLeft: '10px', 
            fontSize: '20px', 
            fontWeight: '500', 
            color: '#1a1a1a' 
          }}>{meme.upvotes.toString()}</span>
        </button>
        
        <button onClick={() => handleVote(false)} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          transition: 'transform 0.2s',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FaThumbsDown size={28} color="#F44336" />
          <span style={{ 
            marginLeft: '10px', 
            fontSize: '20px', 
            fontWeight: '500', 
            color: '#1a1a1a' 
          }}>{meme.downvotes.toString()}</span>
        </button>
      </div>
      
      <p style={{ 
        marginBottom: '20px', 
        fontSize: '20px', 
        fontWeight: '400' 
      }}>Score: <strong>{meme.score.toString()}</strong></p>
      <p style={{ 
        marginBottom: '20px', 
        fontSize: '20px', 
        fontWeight: '400' 
      }}>Tip amount: <strong>{ethers.utils.formatEther(meme.tipAmount)} ETH</strong></p>
      
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '25px' 
      }}>
        <input
          type="text"
          value={tipAmount}
          onChange={(e) => setTipAmount(e.target.value)}
          placeholder="Tip amount in ETH"
          style={{ 
            flex: '1', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #ccc',
            fontSize: '16px',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        />
        <button onClick={handleTip} style={{ 
          padding: '12px 20px', 
          borderRadius: '8px', 
          backgroundColor: '#CA1D26', 
          color: 'white', 
          cursor: 'pointer', 
          border: 'none', 
          fontWeight: '600',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0323E'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#CA1D26'}
        >Tip</button>
      </div>
      
      <h3 style={{ 
        fontSize: '22px', 
        marginBottom: '20px', 
        color: '#1a1a1a' 
      }}>Comments:</h3>
      
      <div style={{ marginBottom: '20px' }}>
        {comments.map((comment, index) => (
          <div key={index} style={{ 
            marginBottom: '15px', 
            padding: '15px', 
            backgroundColor: '#f7f7f7', 
            borderRadius: '8px', 
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' 
          }}>
            <p style={{ 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#333' 
            }}>{`${comment.commenter.slice(0, 5)}...`}</p>
            <p style={{ 
              margin: '0', 
              fontSize: '18px', 
              color: '#555' 
            }}>{comment.content}</p>
          </div>
        ))}
      </div>
  
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          style={{ 
            flex: '1', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #ccc', 
            fontSize: '16px',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        />
        <button onClick={handleAddComment} style={{ 
          padding: '12px 20px', 
          borderRadius: '8px', 
          backgroundColor: '#CA1D26', 
          color: 'white', 
          cursor: 'pointer', 
          border: 'none', 
          fontWeight: '600',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0323E'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#CA1D26'}
        >Add Comment</button>
      </div>
    </div>
  );
  
}

export default MemeDetail;