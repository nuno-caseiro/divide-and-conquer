import { ReactElement, Suspense, useEffect } from 'react';

import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout/Layout';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import UserHeader from '@/components/Users/User/Header/Header';

import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getTeamsOfUser } from '@/api/teamService';
import { useSetRecoilState } from 'recoil';
import { userTeamsListState } from '@/store/team/atom/team.atom';
import useTeam from '@/hooks/useTeam';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/router';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import { ROUTES } from '@/utils/routes';
import { getUser } from '@/api/userService';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import TeamsList from '@/components/Teams/TeamsList/TeamList';

const UserDetails = () => {
  const { replace } = useRouter();

  // Recoil States
  const setTeamsListState = useSetRecoilState(userTeamsListState);

  // Hooks
  const {
    getUserById: { data: userData, isFetching: fetchingUser },
  } = useUser();

  const {
    fetchTeamsOfSpecificUser: { data: userTeams, isFetching: fetchingTeams },
  } = useTeam();

  useEffect(() => {
    if (userTeams) setTeamsListState(userTeams);
  }, [userTeams, setTeamsListState]);

  if (!userData || !userTeams) {
    replace(ROUTES.Users);
    return null;
  }

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <UserHeader user={userData} />
      <Flex
        css={{ height: '100%', position: 'relative', overflowY: 'auto', pr: '$8' }}
        direction="column"
      >
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            {fetchingUser || fetchingTeams ? (
              <Flex justify="center" css={{ mt: '$16' }}>
                <Dots />
              </Flex>
            ) : (
              <TeamsList teams={userTeams} />
            )}
          </QueryError>
        </Suspense>
      </Flex>
    </Flex>
  );
};

UserDetails.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(async (context) => {
  const userId = String(context.query.userId);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(['userById', userId], () => getUser(userId, context)),
    queryClient.prefetchQuery(['teams', userId], () => getTeamsOfUser(userId, context)),
  ]);

  return {
    props: {
      key: userId,
      dehydratedState: dehydrate(queryClient),
    },
  };
});

export default UserDetails;
