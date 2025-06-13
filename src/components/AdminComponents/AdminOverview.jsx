import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Container,
  useTheme,
  alpha,
  LinearProgress,
  IconButton
} from "@mui/material";
import {
  People as PeopleIcon,
  SupervisorAccount as LibrarianIcon,
  MenuBook as BookIcon,
  CheckCircle as AvailableIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";

const AdminOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const name=localStorage.getItem("userName");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:8080/borrow/dashboard", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, description }) => (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
          border: `1px solid ${alpha(color, 0.3)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: color,
                fontWeight: 600,
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1
              }}
            >
              {value || 0}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '0.875rem'
              }}
            >
              {description}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 56,
              height: 56,
              border: `2px solid ${alpha(color, 0.2)}`
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <CircularProgress 
              size={80} 
              thickness={3}
              sx={{ 
                color: theme.palette.primary.main,
                mb: 4
              }}
            />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2
              }}
            >
              Loading Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary
              }}
            >
              Fetching your library analytics...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  const availabilityRate = dashboardData?.total_copies > 0 
    ? ((dashboardData.total_copies_available / dashboardData.total_copies) * 100).toFixed(1)
    : 0;

  const utilizationRate = (100 - parseFloat(availabilityRate)).toFixed(1);

  return (
    <Box
      // sx={{
      //   minHeight: '100vh',
      //   background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`
      // }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Simple Header */}
       <Typography variant="h4" fontWeight={600} color="#3F51B5" sx={{ mb: 2}} >
         Welcome Back, {name}!
        </Typography>

        {/* Stats Grid - Keeping your cards exactly as they are */}
        <Grid container spacing={3} sx={{ mb: 4}}  >
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Librarians"
              value={dashboardData?.num_librarians}
              icon={<LibrarianIcon fontSize="large" />}
              color={theme.palette.primary.main}
              description="Total staff members"
             
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3} >
            <StatCard
              title="Members"
              value={dashboardData?.num_members}
              icon={<PeopleIcon fontSize="large" />}
              color={theme.palette.success.main}
              description="Registered users"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Copies" 
              value={dashboardData?.total_copies}
              icon={<BookIcon fontSize="large" />}
              color={theme.palette.info.main}
              description="Books in collection"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Available"
              value={dashboardData?.total_copies_available}
              icon={<AvailableIcon fontSize="large" />}
              color={theme.palette.warning.main}
              description="Ready to borrow"
            />
          </Grid>
        </Grid>

       
        <Grid container spacing={3}>
          {/* <Grid item xs={12} lg={8}>
            <Paper 
              elevation={0}
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                height: '100%'
              }}
            >
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    mr: 2,
                    width: 48,
                    height: 48
                  }}
                >
                  <AssessmentIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  Analytics Overview
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Staff to Member Ratio
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main, mb: 1 }}>
                      1:{dashboardData?.num_members && dashboardData?.num_librarians 
                        ? Math.round(dashboardData.num_members / dashboardData.num_librarians) 
                        : 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Members per librarian
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Books per Member
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.success.main, mb: 1 }}>
                      {dashboardData?.total_copies && dashboardData?.num_members 
                        ? Math.round(dashboardData.total_copies / dashboardData.num_members) 
                        : 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Collection accessibility
                    </Typography>
                  </Box>
                </Grid>
                {/* <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Collection Status
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 800, 
                        color: availabilityRate > 70 ? theme.palette.success.main : 
                               availabilityRate > 40 ? theme.palette.warning.main : 
                               theme.palette.error.main,
                        mb: 1
                      }}
                    >
                      {availabilityRate > 70 ? "Excellent" : availabilityRate > 40 ? "Good" : "Critical"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Overall health rating
                    </Typography>
                  </Box>
                </Grid> */}
              {/* </Grid>
            </Paper>
          </Grid> */} 

          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={0}
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                height: '100%'
              }}
            >
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    mr: 2,
                    width: 48,
                    height: 48
                  }}
                >
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  Utilization Metrics
                </Typography>
              </Box>
              
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Books in Use
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                    {utilizationRate}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(utilizationRate)} 
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.secondary.main} 100%)`
                    }
                  }}
                />
              </Box>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Available Stock
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                    {availabilityRate}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(availabilityRate)} 
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: theme.palette.success.main
                    }
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box textAlign="center">
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  System Status
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: theme.palette.success.main,
                      mr: 1,
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                    All Systems Operational
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminOverview;