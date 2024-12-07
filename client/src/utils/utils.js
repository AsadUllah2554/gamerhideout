const formatTimeAgo = (timestamp) => {
    const currentTime = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((currentTime - postTime) / 1000);
  
    const units = [
      { name: 'year', seconds: 31536000 },
      { name: 'month', seconds: 2592000 },
      { name: 'week', seconds: 604800 },
      { name: 'day', seconds: 86400 },
      { name: 'hour', seconds: 3600 },
      { name: 'minute', seconds: 60 },
      { name: 'second', seconds: 1 }
    ];
  
    for (let unit of units) {
      const interval = Math.floor(diffInSeconds / unit.seconds);
      
      if (interval >= 1) {
        return interval === 1 
          ? `1 ${unit.name} ago` 
          : `${interval} ${unit.name}s ago`;
      }
    }
  
    return 'just now';
  };

  export { formatTimeAgo };