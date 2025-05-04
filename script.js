document.addEventListener('DOMContentLoaded', () => {
    const sun = document.querySelector('.sun');
    const root = document.documentElement;
    let lastScrollTop = 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    function updateSunPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / maxScroll) * 100;
        
        // Update sun position with curved path
        const basePosition = scrollPercent;
        const curveOffset = Math.sin((scrollPercent / 100) * Math.PI) * 10; // 10% curve
        const sunPosition = basePosition + curveOffset;
        root.style.setProperty('--sun-position', `${sunPosition}%`);
        
        // Update shadow opacity based on sun position (more dramatic)
        const shadowOpacity = Math.abs(50 - scrollPercent) / 50 * 0.6;
        root.style.setProperty('--shadow-opacity', shadowOpacity);
        
        // Update shadow angle based on sun position
        const shadowAngle = (scrollPercent / 100) * 180;
        root.style.setProperty('--shadow-angle', `${shadowAngle}deg`);
        
        // Update sun size based on position (appears larger at horizon)
        const sunSize = 80 + Math.abs(50 - scrollPercent) / 2;
        sun.style.width = `${sunSize}px`;
        sun.style.height = `${sunSize}px`;
        
        // Update background color based on sun position
        updateBackgroundColor(scrollPercent);
        
        lastScrollTop = scrollTop;
    }
    
    function updateBackgroundColor(scrollPercent) {
        let skyColor;
        
        if (scrollPercent < 15) {
            // Early morning - soft pink to light blue
            const earlyMorningProgress = scrollPercent / 15;
            skyColor = interpolateColor('#a18cd1', '#ffecd2', earlyMorningProgress);
        } else if (scrollPercent < 30) {
            // Morning - light blue to bright blue
            const morningProgress = (scrollPercent - 15) / 15;
            skyColor = interpolateColor('#ffecd2', '#87CEEB', morningProgress);
        } else if (scrollPercent < 60) {
            // Midday - bright blue
            skyColor = '#87CEEB';
        } else if (scrollPercent < 80) {
            // Afternoon - bright blue to warm orange
            const afternoonProgress = (scrollPercent - 60) / 20;
            skyColor = interpolateColor('#87CEEB', '#fecfef', afternoonProgress);
        } else {
            // Sunset - warm orange to purple
            const sunsetProgress = (scrollPercent - 80) / 20;
            skyColor = interpolateColor('#fecfef', '#a18cd1', sunsetProgress);
        }
        
        root.style.setProperty('--sky-color', skyColor);
    }
    
    function interpolateColor(color1, color2, factor) {
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);
        
        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // Update on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateSunPosition);
    });

    // Initial update
    updateSunPosition();

    // Timeline functionality
    function initTimeline() {
        const events = document.querySelectorAll('.event');
        const markers = document.querySelectorAll('.timeline-marker');
        const timelineContainer = document.querySelector('.timeline-container');
        const scheduleSection = document.querySelector('.schedule');
        
        // Position markers along the timeline
        markers.forEach((marker, index) => {
            const position = (index / (markers.length - 1)) * 100;
            marker.style.top = `${position}%`;
        });
        
        function updateTimeline() {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const scheduleTop = scheduleSection.offsetTop;
            const scheduleHeight = scheduleSection.offsetHeight;
            const scheduleBottom = scheduleTop + scheduleHeight;
            
            // Check if we're in the schedule section
            const isInScheduleSection = scrollPosition >= scheduleTop && 
                                       scrollPosition < scheduleBottom;
            
            if (isInScheduleSection) {
                // Calculate progress through the schedule section (0 to 1)
                const sectionProgress = (scrollPosition - scheduleTop) / (scheduleHeight - windowHeight);
                const progress = Math.min(Math.max(sectionProgress, 0), 1);
                
                // Update active marker
                const activeIndex = Math.floor(progress * (markers.length - 1));
                markers.forEach((marker, index) => {
                    if (index === activeIndex) {
                        marker.classList.add('active');
                    } else {
                        marker.classList.remove('active');
                    }
                });
                
                // Show/hide events based on scroll position
                events.forEach(event => {
                    const eventTop = event.getBoundingClientRect().top;
                    const eventBottom = event.getBoundingClientRect().bottom;
                    
                    if (eventTop < windowHeight * 0.8 && eventBottom > 0) {
                        event.classList.add('visible');
                    } else {
                        event.classList.remove('visible');
                    }
                });
            } else {
                // Reset markers when not in schedule section
                markers.forEach(marker => marker.classList.remove('active'));
                events.forEach(event => event.classList.remove('visible'));
            }
        }
        
        // Initial update
        updateTimeline();
        
        // Update on scroll
        window.addEventListener('scroll', updateTimeline);
        window.addEventListener('resize', updateTimeline);
    }

    // Initialize timeline when DOM is loaded
    initTimeline();
}); 